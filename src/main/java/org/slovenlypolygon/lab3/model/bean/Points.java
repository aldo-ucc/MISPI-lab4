package org.slovenlypolygon.lab3.model.bean;

import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import org.slovenlypolygon.lab3.model.utils.DataBaseHelper;

import java.io.Serializable;
import java.util.List;

@Named(value = "points")
@SessionScoped
public class Points implements Serializable {
    private final DataBaseHelper dataBaseHelper = new DataBaseHelper();

    public List<Point> getPoints() {
        return dataBaseHelper.getPoints();
    }

    public List<Point> getUserPoints() {
        return dataBaseHelper.getUserPoints(FacesContext.getCurrentInstance().getExternalContext().getSessionId(true));
    }

    public void addPoint(Point point) {
        point.checkCoordinates();
        point.setOwner(FacesContext.getCurrentInstance().getExternalContext().getSessionId(true));
        if (dataBaseHelper.addPoint(point)) System.out.println(point + " was successfully added");
    }
}