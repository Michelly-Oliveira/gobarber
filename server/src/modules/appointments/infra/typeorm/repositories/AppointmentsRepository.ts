import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IApppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

// Have more control over our repository and how it works, so that if we need to change TypeORM we can still maintain our repo and services - define all methods we will need, and inside them we can use the repository provided by typeorm and its methods
class AppointmentsRepository implements IAppointmentsRepository {
  // Declare a private variable for the repository from TypeORM - Repository for model Appointment
  private ormRepository: Repository<Appointment>;

  // Initialize our repository with te base repo from typeorm
  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    // Check if date exists for a specific provider
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // Add zero to months with 1 digit
    const parsedMonth = String(month).padStart(2, '0');

    // Raw(dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}`):
    // Get the date from the database and turn it into a string with the format MM-YYYY(month-year) and check if it's equal to the passed month-year params

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    // Raw(dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}`):
    // Get the date from the database and turn it into a string with the format MM-YYYY(month-year) and check if it's equal to the passed month-year params

    // Add relations users to load all the information of the user that booked the appointment
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    // Create appointment
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    // Save appointment on database
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
