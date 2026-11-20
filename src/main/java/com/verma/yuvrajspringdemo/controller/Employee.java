package com.verma.yuvrajspringdemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class Employee {

    @GetMapping("/user")
    public String userAccess() {
        return "Welcome Yuvraj";
    }

    @GetMapping("/admin")
    public String adminAccess() {
        return "Welcome admin.";
    }
}

