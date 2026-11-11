from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_welcome_email(user_id):

    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)

        subject = "Welcome to Movies App!"

        message = f"""
Hello,

Welcome to Movies App!

Your account has been successfully created.

Now you can explore and discover your favorite movies.

Thank you for joining us!

Regards,
Movies App Team
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return f"Welcome email sent to {user.email}"

    except User.DoesNotExist:
        return f"User with ID {user_id} does not exist"
