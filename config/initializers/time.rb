# This module force not to return millisenconds value in the Time
# class when invoking now class method.
# It's necessary because Druid, the main Datasource, doesn't work
# with millisenconds. Comparing times with millisenconds with time
# returned from Druid, sometimes fail.

module TimeNowWithoutMilli
  def now
    t = super
    t.change(nsec: 0)
  end
end

Time.singleton_class.prepend TimeNowWithoutMilli
