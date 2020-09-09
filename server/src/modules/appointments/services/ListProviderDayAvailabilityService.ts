import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRespository from '../repositories/IApppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

// Return an array of objects with the format {day, available}
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRespository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    // Get all appointments on a day
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      },
    );

    const hourStart = 8;

    // Each position of the array correspond to an appointment hour, from 8am to 5pm
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    // Get current yyyy-mm-dd-hour
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      // See if there is an appointment in this hour
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) == hour,
      );

      // Get yyyy-mm-dd-hour using the params
      const compareDate = new Date(year, month - 1, day, hour);

      // If hasAppointmentInHour is true, there is an appointment already booked in that hour, so it is not available
      // If hasAppointmentInHour is false, the hour is still available to be booked
      // Check if the hour for the appointment is after the current hour, don't make available an hour that already passed
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
