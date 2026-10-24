package com.busgo.repositories;

import com.busgo.models.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findBySourceCityIgnoreCaseAndDestinationCityIgnoreCase(String sourceCity, String destinationCity);
    List<Route> findBySourceCityIgnoreCase(String sourceCity);
}
