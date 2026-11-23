package com.verma.yuvrajspringdemo.repository;

import com.verma.yuvrajspringdemo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);
}