package com.skillforge.repository;

import com.skillforge.entity.DsaProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DsaProgressRepository extends JpaRepository<DsaProgress, Long> {

    List<DsaProgress> findByUserId(Long userId);

    Optional<DsaProgress> findByIdAndUserId(Long id, Long userId);

    Optional<DsaProgress> findByUserIdAndTopic(Long userId, String topic);
}
