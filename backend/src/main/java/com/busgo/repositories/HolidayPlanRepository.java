package com.busgo.repositories;

import com.busgo.models.HolidayPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HolidayPlanRepository extends JpaRepository<HolidayPlan, Long> {
    List<HolidayPlan> findByPublishedTrueOrderByIdDesc();
    List<HolidayPlan> findAllByOrderByIdDesc();
}
