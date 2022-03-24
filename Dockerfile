FROM tensorflow/tensorflow:latest-gpu

ADD . /app
RUN python3 -m pip install -r app/api/requirements.txt
RUN python3 -m pip install numpy --upgrade

EXPOSE 8000

ENV NAME OpentoALL

CMD ["python", "app/api/main.py"]