# Start from the Python 3.11 slim image
FROM python:3.10-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the local directory contents to the container's /app directory
COPY . /app

# Install the dependencies from requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

# Expose port 80 to allow communication to/from the server
EXPOSE 80

# Define the command to run the app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]