package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.RatingEntity;
import com.ByteMarket.byte_market_api.Service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/rating")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @GetMapping("/getAllRating")
    public List<RatingEntity> getAllRating() {
        return ratingService.getAllRatings();
    }
    @GetMapping("/getRatingById/{id}")
    public RatingEntity getRatingById(@PathVariable int id) {
        return ratingService.getRatingById(id);
    }
    @PostMapping("/addRating")
    public RatingEntity addRating(@RequestBody RatingEntity rating) {
        rating.setRatingdate(LocalDate.now());
        return ratingService.addRating(rating);
    }
    @PutMapping("/updateRating/{id}")
    public RatingEntity updateRating(@PathVariable int id, @RequestBody RatingEntity rating) {
        return ratingService.updateRating(id, rating);
    }
    @DeleteMapping("/deleteRating/{id}")
    public void deleteRating(@PathVariable int id) {
        ratingService.deleteRating(id);
    }
}
