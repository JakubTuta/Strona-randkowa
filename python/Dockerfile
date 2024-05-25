FROM python

COPY src/ /app
WORKDIR /app

RUN pip install -r modules.txt

CMD ["python", "server.py"]

EXPOSE 2137