package com.busgo.repositories;

import com.busgo.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRouteId(Long routeId);

    @Query("SELECT s FROM Schedule s WHERE LOWER(s.route.sourceCity) = LOWER(:source) AND LOWER(s.route.destinationCity) = LOWER(:dest)")
    List<Schedule> findBySourceAndDestination(@Param("source") String source, @Param("dest") String dest);
}
