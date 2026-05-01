package com.carebridge.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CategoryConverter implements AttributeConverter<Category, String> {

    @Override
    public String convertToDatabaseColumn(Category category) {
        return category == null ? null : category.name();
    }

    @Override
    public Category convertToEntityAttribute(String value) {
        if (value == null) return null;
        try {
            return Category.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown Category value in DB: '" + value + "'");
        }
    }
}
