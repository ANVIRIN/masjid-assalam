FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/app.py .

# Copy frontend files
COPY index.html .
COPY css ./css
COPY js ./js
COPY images ./images
COPY admin ./admin

# Upload directory
RUN mkdir -p uploads

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
