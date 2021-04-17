import { Injectable } from '@nestjs/common';
import { RabbitMQ } from 'src/rabbitmq/RabbitMQ';
import axios from 'axios';

@Injectable()
export class AppService {
  private rabbitMQ: RabbitMQ;
  private rabbitMQ2: RabbitMQ;

  constructor() {
    this.rabbitMQ = new RabbitMQ('main_queue');
    this.rabbitMQ2 = new RabbitMQ('main_queue2');
  }

  async hello(data: string) {
    this.rabbitMQ.publisher.publish(data);
    this.rabbitMQ.consumer.consume();
    this.rabbitMQ2.publisher.publish(data);
  }

  async geocode(coords: any) {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?language=pt-BR&latlng=${coords.latitude},${coords.longitude}&key=${process.env.GOOGLE_API_KEY}`,
      );
      const location = {
        full_address: data['results'][0]['formatted_address'],
        address: data['results'][1]['formatted_address'],
        street:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('route'),
          ).long_name || '',
        number:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('street_number'),
          ).long_name || '',
        city:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('administrative_area_level_2'),
          ).long_name || '',
        district:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('sublocality_level_1'),
          ).long_name || '',
        state:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('administrative_area_level_1'),
          ).long_name || '',
        country:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('country'),
          ).long_name || '',
        postal_code:
          data['results'][0]['address_components'].find((c) =>
            c['types'].includes('postal_code'),
          ).long_name || '',
      };
      return location;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async markersByCity(city: string) {
    try {
      const { data } = await axios.get(
        `http://where-not-to-go-service.herokuapp.com/v1/app/marker-report/find/${city}`,
      );
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
