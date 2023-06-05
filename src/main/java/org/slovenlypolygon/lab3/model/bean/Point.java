package org.slovenlypolygon.lab3.model.bean;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@Named(value = "point")
@SessionScoped
public class Point implements Serializable {
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
    private double x, y, r;
    private Date date;
    private boolean result;
    private String owner;

    public Point(double x, double y, double r, Date date, boolean result, String resultString, String owner) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.date = date;
        this.result = result;
        this.owner = owner;
    }

    public Point() {
        date = new Date();
    }

    public void checkCoordinates() {
        if (x <= 0 && y >= 0 && x >= -r && y <= r) result = true;
        else if (x <= 0 && y <= 0 && y > -2 * x - r) result = true;
        else if (x >= 0 && y <= 0 && (x * x + y * y) <= r * r / 4) result = true;
        else result = false;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public Date getDate() {
        return date;
    }

    public String getFormatDate() {
        return formatter.format(date);
    }

    public boolean isResult() {
        return result;
    }

    public String getResult() {
        return isResult() ? "yes" : "no";
    }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setR(double r) {
        this.r = r;
    }

    public void setOwner(String sessionId) {
        this.owner = sessionId;
    }

    public String getOwner() {
        return owner;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return Double.compare(point.x, x) == 0 && Double.compare(point.y, y) == 0 && Double.compare(point.r, r) == 0 && result == point.result && Objects.equals(date, point.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y, r, date, result);
    }

    @Override
    public String toString() {
        return "{Point (" +
                "x: " + x +
                "; y: " + y +
                "; r: " + r +
                ")" +
                " result: " + getResult()  +
                " owner: " + owner + "}";
    }
}