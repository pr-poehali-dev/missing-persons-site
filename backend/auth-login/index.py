import json
import os
import urllib.parse

import psycopg2


def handler(event: dict, context) -> dict:
    """Авторизация пользователя по логину и паролю через базу данных."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    body = json.loads(event.get('body') or '{}')
    login = body.get('login', '').strip()
    password = body.get('password', '').strip()

    if not login or not password:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Введите логин и пароль'}),
        }

    dsn = os.environ['DATABASE_URL']
    if '?' in dsn:
        dsn += '&sslmode=disable'
    else:
        dsn += '?sslmode=disable'
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    cur.execute(
        "SELECT id, full_name, login, role, department, rank, is_active, created_at "
        "FROM t_p56151072_missing_persons_site.users "
        "WHERE login = %s AND password = %s",
        (login, password),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Неверный логин или пароль'}),
        }

    user_id, full_name, user_login, role, department, rank, is_active, created_at = row

    if not is_active:
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Учётная запись заблокирована'}),
        }

    user = {
        'id': str(user_id),
        'fullName': full_name,
        'login': user_login,
        'role': role,
        'department': department,
        'rank': rank,
        'isActive': is_active,
        'createdAt': created_at.isoformat() if created_at else None,
    }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'user': user}),
    }