FROM python:3.12-slim

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      git \
      ffmpeg \
      libsndfile1 \
      curl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Patch pytorch-lightning loggers to export NeptuneLogger to prevent nemo_toolkit crash
RUN python -c "import os; import pytorch_lightning; init_path = os.path.join(os.path.dirname(pytorch_lightning.__file__), 'loggers', '__init__.py'); f = open(init_path, 'r'); c = f.read(); f.close(); 'NeptuneLogger' not in c and (f := open(init_path, 'w')).write(c.replace('from pytorch_lightning.loggers.wandb import WandbLogger', 'from pytorch_lightning.loggers.wandb import WandbLogger\nfrom pytorch_lightning.loggers.neptune import NeptuneLogger').replace('\"WandbLogger\",', '\"WandbLogger\",\n    \"NeptuneLogger\",')) and f.close()"

# Copy application code
COPY . .

# Expose API port
EXPOSE 8000

# Start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
