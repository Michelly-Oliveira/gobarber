import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability of a provider', async () => {
    // Create appointments - provider is not available on these days/hours
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 13, 0, 0),
    });

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

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 27, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 6, 28, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 7,
    });

    // Expect that availability is an array that contains the objects {day: 27, available: false}, {day: 28, available: false}
    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 26, available: true },
        { day: 27, available: false },
        { day: 28, available: true },
        { day: 29, available: true },
      ]),
    );
  });
});
