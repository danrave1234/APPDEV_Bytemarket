package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.RatingEntity;
import com.ByteMarket.byte_market_api.Repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    //Get
    public List<RatingEntity> getAllRatings() {
        return ratingRepository.findAll();
    }

    public RatingEntity getRatingById(int id) {
        return ratingRepository.findById(id).get();
    }
    //Add
    public RatingEntity addRating(RatingEntity rating) {
        return ratingRepository.save(rating);
    }
    //Update
    public RatingEntity updateRating(RatingEntity rating) {
        return ratingRepository.save(rating);
    }
    //Delete
    public RatingEntity deleteRating(int id) {
        ratingRepository.deleteById(id);
        return null;
    }
}
