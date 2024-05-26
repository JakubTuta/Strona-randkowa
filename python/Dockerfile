FROM python

COPY src/ /app
WORKDIR /app

RUN pip install -r modules.txt

ENV PORT 2137
ENV HOST 0.0.0.0

CMD ["python", "server.py"]

EXPOSE 2137