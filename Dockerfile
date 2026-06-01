FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app
COPY backend/app.py .
COPY backend/procfile .
COPY backend/runtime.txt .

# Copy all frontend static files to root of container
COPY index.html .
COPY css ./css
COPY js ./js
COPY images ./images
COPY admin ./admin

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "-w", "2", "--timeout", "120", "app:app"]
