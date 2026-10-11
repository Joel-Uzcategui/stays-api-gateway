import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  AUTH_SERVICE,
  BOOKING_SERVICE,
  CATALOG_SERVICE,
  PAYMENT_SERVICE,
  SEARCH_SERVICE,
  envs,
} from '../config';

const clients = ClientsModule.register([
  {
    name: AUTH_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqUrl],
      queue: envs.authQueue,
      queueOptions: { durable: true },
    },
  },
  {
    name: CATALOG_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqUrl],
      queue: envs.catalogQueue,
      queueOptions: { durable: true },
    },
  },
  {
    name: SEARCH_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqUrl],
      queue: envs.searchQueue,
      queueOptions: { durable: true },
    },
  },
  {
    name: BOOKING_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqUrl],
      queue: envs.bookingQueue,
      queueOptions: { durable: true },
    },
  },
  {
    name: PAYMENT_SERVICE,
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqUrl],
      queue: envs.paymentQueue,
      queueOptions: { durable: true },
    },
  },
]);

@Module({
  imports: [clients],
  exports: [clients],
})
export class RabbitMQModule {}
