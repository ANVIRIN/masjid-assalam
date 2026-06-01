FROM python:3.11-slim

WORKDIR /app

# install dependency
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend
COPY backend/app.py .

# copy frontend
COPY index.html .
COPY css ./css
COPY js ./js
COPY images ./images
COPY admin ./admin

EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]