import json
import os
import urllib.parse

import psycopg2


SCHEMA = 't_p56151072_missing_persons_site'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}


def get_conn():
    dsn = os.environ['DATABASE_URL']
    if '?' in dsn:
        dsn += '&sslmode=disable'
    else:
        dsn += '?sslmode=disable'
    return psycopg2.connect(dsn)


def handler(event: dict, context) -> dict:
    """Управление пользователями: создание, блокировка/разблокировка, удаление."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    # POST / — создание пользователя
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        full_name = body.get('fullName', '').strip()
        login = body.get('login', '').strip()
        password = body.get('password', '').strip()
        role = body.get('role', 'officer')
        department = body.get('department', '').strip()
        rank = body.get('rank', '').strip() or None

        if not full_name or not login or not password or not department:
            return {
                'statusCode': 400,
                'headers': CORS,
                'body': json.dumps({'success': False, 'error': 'Заполните все обязательные поля'}),
            }

        if role not in ('admin', 'inspector', 'officer'):
            return {
                'statusCode': 400,
                'headers': CORS,
                'body': json.dumps({'success': False, 'error': 'Недопустимая роль'}),
            }

        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (full_name, login, password, role, department, rank, is_active) "
                "VALUES (%s, %s, %s, %s, %s, %s, TRUE) "
                "RETURNING id, full_name, login, role, department, rank, is_active, created_at",
                (full_name, login, password, role, department, rank),
            )
            row = cur.fetchone()
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': CORS,
                'body': json.dumps({'success': False, 'error': 'Пользователь с таким логином уже существует'}),
            }
        finally:
            cur.close()
            conn.close()

        user_id, fn, lg, rl, dp, rk, active, created_at = row
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'success': True, 'user': {
                'id': str(user_id),
                'fullName': fn,
                'login': lg,
                'role': rl,
                'department': dp,
                'rank': rk,
                'isActive': active,
                'createdAt': created_at.isoformat(),
            }}),
        }

    # PUT /{id}/toggle — блокировка/разблокировка
    if method == 'PUT' and '/toggle' in path:
        user_id = path.strip('/').replace('toggle', '').strip('/')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.users SET is_active = NOT is_active WHERE id = %s RETURNING is_active",
            (user_id,),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if not row:
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'success': False, 'error': 'Пользователь не найден'})}
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True, 'isActive': row[0]})}

    # DELETE /{id} — удаление
    if method == 'DELETE':
        user_id = path.strip('/')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.users WHERE id = %s", (user_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}
