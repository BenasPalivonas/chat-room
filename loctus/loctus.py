#run with locust -f loctus.py   
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1,5)

    @task
    def index_page(self):
        self.client.get(url="/login")
    @task
    def room_page(self):
        self.client.get(url="/room/test/1")