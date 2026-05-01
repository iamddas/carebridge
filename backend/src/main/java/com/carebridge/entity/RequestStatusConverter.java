package com.carebridge.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RequestStatusConverter implements AttributeConverter<RequestStatus, String> {

    @Override
    public String convertToDatabaseColumn(RequestStatus status) {
        return status == null ? null : status.name();
    }

    @Override
    public RequestStatus convertToEntityAttribute(String value) {
        if (value == null) return null;
        try {
            return RequestStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown RequestStatus value in DB: '" + value + "'");
        }
    }
}
