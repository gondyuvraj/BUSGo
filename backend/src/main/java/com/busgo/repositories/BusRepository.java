package com.busgo.repositories;

import com.busgo.models.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByBusType(String busType);
    List<Bus> findByOperatorNameContainingIgnoreCase(String operatorName);
}
