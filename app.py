import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

from flask import Flask, jsonify, request, render_template
from whitenoise import WhiteNoise


app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, root='static/', prefix='static/')


def _send_contact_email(name: str, phone: str, email: str, message: str) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    target_email = os.getenv("TARGET_EMAIL")

    if not all([smtp_host, smtp_username, smtp_password, target_email]):
        raise RuntimeError(
            "Missing SMTP config. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, TARGET_EMAIL."
        )

    safe_email = email or "Не указан"
    safe_message = message or "Сообщение не указано"

    msg = EmailMessage()
    msg["Subject"] = f"Новая заявка с сайта БИС - {name}"
    msg["From"] = smtp_username
    msg["To"] = target_email
    msg.set_content(
        "\n".join(
            [
                "Новая заявка с сайта:",
                f"Имя: {name}",
                f"Телефон: {phone}",
                f"Email: {safe_email}",
                "",
                "Сообщение:",
                safe_message,
            ]
        )
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/<page_name>")
def page(page_name: str):
    if page_name.endswith('.html'):
        page_name = page_name[:-5]
    
    try:
        return render_template(f"{page_name}.html")
    except Exception:
        return render_template("404.html"), 404


@app.post("/api/contact")
def contact():
    payload = request.get_json(silent=True) or {}

    name = (payload.get("name") or "").strip()
    phone = (payload.get("phone") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name or not phone:
        return (
            jsonify(
                {
                    "ok": False,
                    "message": "Пожалуйста, заполните обязательные поля: имя и телефон.",
                }
            ),
            400,
        )

    try:
        _send_contact_email(name=name, phone=phone, email=email, message=message)
    except Exception:
        return (
            jsonify(
                {
                    "ok": False,
                    "message": "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.",
                }
            ),
            500,
        )

    return jsonify({"ok": True, "message": "Заявка успешно отправлена."})

if __name__ == "__main__":
    app.run(debug=True)
