import pytest
from fastapi.testclient import TestClient
from main import app  # Assuming your FastAPI app is in main.py

client = TestClient(app)
# def test_dummy():
#     assert True


@pytest.fixture(scope="module")
def create_playbook():
    response = client.post("/playbooks/", json={
        "name": "Test Playbook",
        "content": "This is a test playbook content"
    })
    assert response.status_code == 200
    return response.json()

@pytest.fixture(scope="module")
def create_document(create_playbook):
    playbook_id = create_playbook["id"]
    response = client.post("/documents/", json={
        "name": "Test Document",
        "content": "This is a test document content",
        "playbook_id": playbook_id
    })
    assert response.status_code == 200
    return response.json()

def test_create_playbook(create_playbook):
    assert "id" in create_playbook
    assert create_playbook["name"] == "Test Playbook"

def test_get_playbooks():
    response = client.get("/playbooks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_document(create_document):
    assert "id" in create_document
    assert create_document["name"] == "Test Document"

def test_get_documents():
    response = client.get("/documents/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_submit_review(create_document):
    document_id = create_document["id"]
    response = client.post("/reviews/", json={
        "document_id": document_id,
        "conflicts": "No conflicts",
        "gaps": "Minor gap",
        "irrelevant": "No irrelevant content"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == document_id

def test_get_reviews():
    response = client.get("/reviews/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

#pytest test_api.py -v
