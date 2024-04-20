import axios from 'axios';
import { Request, Response } from 'express';

const getWeatherForDateAndHour = async (req: Request, res: Response) => {
  const { date, hour } = req.body;
  if (!date || !hour) {
    return res.status(400).json({ message: 'Date and hour are required.' });
  }

  const API_KEY = '1ea05cac06e828e7f8de781b5242f74c';
  const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast';

  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        q: 'Raleigh,NC,US',
        appid: API_KEY,
        units: 'imperial',
        cnt: '40'
      }
    });

    const adjustedHour = Math.round(hour / 3) * 3;
    const adjustedHourString = `${adjustedHour < 10 ? '0' + adjustedHour : adjustedHour}:00:00`;
    const forecast = response.data.list.find(
      (item: any) => item.dt_txt.startsWith(`${date} ${adjustedHourString}`)
    );
    if (!forecast) {
      return res.status(404).json({ message: 'No weather data found for the specified date and hour.' });
    }
    const expectedTemperature = forecast.main.temp;
    const expectedClimate = forecast.weather[0].main;
    const expectedWinds = forecast.wind.speed > 10 ? 'heavy' : forecast.wind.speed > 5 ? 'moderate' : 'light';
    const expectedSunCoverage = forecast.clouds.all < 20 ? 'great' : forecast.clouds.all < 50 ? 'good' : 'bad';
    
    return res.json({
      date,
      hour,
      expectedTemperature,
      expectedClimate,
      expectedWinds,
      expectedSunCoverage
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};

export { getWeatherForDateAndHour };