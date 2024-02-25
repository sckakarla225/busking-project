import pytest
from api.main import app
from httpx import AsyncClient

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
        
@pytest.mark.asyncio
async def test_app_index(client):
    response = await client.get('/predictions/')
    assert response.status_code == 200
    assert response.json() == { 'App': 'Index' }
    
@pytest.mark.asyncio
async def test_predict_spots(client):
    spots_to_predict = [
        {
            "spot_id": "01BS8Q3ZFlLWq3FtB6UU",
            "latitude": 35.77844374,
            "longitude": -78.64537191,
            "date": "3/18/24",
            "time": "8:00 AM",
            "day": "Monday"
        },
        {
            "spot_id": "01BS8Q3ZFlLWq3FtB6UU",
            "latitude": 35.77844374,
            "longitude": -78.64537191,
            "date": "3/19/24",
            "time": "10:00 AM",
            "day": "Tuesday"
        },
        {
            "spot_id": "01BS8Q3ZFlLWq3FtB6UU",
            "latitude": 35.77844374,
            "longitude": -78.64537191,
            "date": "3/20/24",
            "time": "9:00 AM",
            "day": "Wednesday"
        }
    ]
    response = await client.post('/predictions/predict-spots', json=spots_to_predict)
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 3
    expected_prediction_values = ["High", "Low", "Medium"]
    prediction_one = response_data[0]
    prediction_two = response_data[1]
    prediction_three = response_data[2]
    
    assert prediction_one["spot_id"] == "01BS8Q3ZFlLWq3FtB6UU"
    assert prediction_one["date"] == "3/18/24"
    assert prediction_one["time"] == "8:00 AM"
    assert prediction_one["prediction_value"] in expected_prediction_values
    
    assert prediction_two["spot_id"] == "01BS8Q3ZFlLWq3FtB6UU"
    assert prediction_two["date"] == "3/19/24"
    assert prediction_two["time"] == "10:00 AM"
    assert prediction_two["prediction_value"] in expected_prediction_values
    
    assert prediction_three["spot_id"] == "01BS8Q3ZFlLWq3FtB6UU"
    assert prediction_three["date"] == "3/20/24"
    assert prediction_three["time"] == "9:00 AM"
    assert prediction_three["prediction_value"] in expected_prediction_values

@pytest.mark.asyncio
async def test_predict_spot(client):
    spot_to_predict = {
        "spot_id": "01BS8Q3ZFlLWq3FtB6UU",
        "latitude": 35.77844374,
        "longitude": -78.64537191,
        "date": "3/18/24",
        "time": "8:00 AM",
        "day": "Monday"
    }
    response = await client.post('/predictions/predict-spot', json=spot_to_predict)
    assert response.status_code == 200
    response_data = response.json()
    expected_prediction_values = ["High", "Low", "Medium"]
    
    assert response_data["spot_id"] == "01BS8Q3ZFlLWq3FtB6UU"
    assert response_data["date"] == "3/18/24"
    assert response_data["time"] == "8:00 AM"
    assert response_data["prediction_value"] in expected_prediction_values