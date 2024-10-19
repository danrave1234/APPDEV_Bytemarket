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
    public RatingEntity updateRating(int id, RatingEntity newRating) {
        RatingEntity ratingEntity = ratingRepository.findById(id).get();
        ratingEntity.setCustomer(newRating.getCustomer());
        ratingEntity.setProduct(newRating.getProduct());
        ratingEntity.setRatingtext(newRating.getRatingtext());

        return ratingRepository.save(ratingEntity);
    }
    //Delete
    public RatingEntity deleteRating(int id) {
        ratingRepository.deleteById(id);
        return null;
    }
}
