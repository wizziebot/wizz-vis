require 'spec_helper'

shared_examples_for 'intervalable' do
  let(:model) { described_class } # the class that includes the concern

  before do
    @time_now = Time.now
    allow(Time).to receive(:now).and_return(@time_now)
  end

  describe 'last intervals' do
    it 'returns last 30 minutes' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'last_30_minutes')
      expect(object.interval).to eq([@time_now - 30.minutes, @time_now])
    end

    it 'returns last 1 hour' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'last_1_hour')
      expect(object.interval).to eq([@time_now - 1.hour, @time_now])
    end

    it 'returns last 6 hours' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'last_6_hours')
      expect(object.interval).to eq([@time_now - 6.hours, @time_now])
    end

    it 'returns last 1 day' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'last_1_day')
      expect(object.interval).to eq([@time_now - 1.day, @time_now])
    end

    it 'returns last 7 days' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'last_7_days')
      expect(object.interval).to eq([@time_now - 7.days, @time_now])
    end

    it 'returns last 30 days' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'last_30_days')
      expect(object.interval).to eq([@time_now - 30.days, @time_now])
    end
  end

  describe 'current intervals' do
    it 'returns current day' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'current_day')
      expect(object.interval).to eq([@time_now.beginning_of_day,
                                     @time_now.tomorrow.beginning_of_day])
    end

    it 'returns current week' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'current_week')
      expect(object.interval).to eq([@time_now.beginning_of_week,
                                     (@time_now + 1.week).beginning_of_week])
    end

    it 'returns current month' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'current_month')
      expect(object.interval).to eq([@time_now.beginning_of_month,
                                     (@time_now + 1.month).beginning_of_month])
    end
  end

  describe 'previous intervals' do
    it 'returns previous day' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'previous_day')
      expect(object.interval).to eq([@time_now.yesterday.beginning_of_day, @time_now.yesterday.end_of_day])
    end

    it 'returns previous week' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'previous_week')
      expect(object.interval).to eq([@time_now.prev_week.beginning_of_week, @time_now.prev_week.end_of_week])
    end

    it 'returns previous month' do
      object = FactoryBot.create(model.to_s.underscore.to_sym, range: 'previous_month')
      expect(object.interval).to eq([@time_now.prev_month.beginning_of_month, @time_now.prev_month.end_of_month])
    end
  end

  describe 'no range' do
    it 'returns start and end time' do
      object = FactoryBot.create(
        model.to_s.underscore.to_sym,
        range: nil,
        start_time: Time.utc(2017, 11, 13),
        end_time: Time.utc(2017, 11, 14)
      )
      expect(object.interval).to eq([Time.utc(2017, 11, 13), Time.utc(2017, 11, 14)])
    end
  end
end
