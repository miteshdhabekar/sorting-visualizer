package com.sortingvisualizer.dsaproject;

import org.springframework.web.bind.annotation.*;
import java.util.Random;

@RestController
public class ArrayController {

    @CrossOrigin(origins = "*") // allow frontend from file:// or other ports
    @GetMapping("/api/array")
    public int[] getRandomArray(@RequestParam(value = "size", defaultValue = "40") int size) {
        if (size < 5) size = 5;
        if (size > 200) size = 200;

        int[] arr = new int[size];
        Random random = new Random();
        for (int i = 0; i < size; i++) {
            arr[i] = random.nextInt(400) + 20;
        }
        return arr;
    }
}
