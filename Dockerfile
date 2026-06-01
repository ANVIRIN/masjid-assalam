FROM python:3.11-slim

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
