import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability of a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 15, 0, 0),
    });

    // Get the current date to check if an appointment hour didn't already passed. All hours before this are unavailable.
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 27, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      day: 27,
      year: 2020,
      month: 7,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 13, available: true },
        { hour: 16, available: true },
      ]),
    );
  });
});
