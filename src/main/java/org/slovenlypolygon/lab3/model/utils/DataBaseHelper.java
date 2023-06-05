package org.slovenlypolygon.lab3.model.utils;

import org.slovenlypolygon.lab3.model.bean.Point;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DataBaseHelper {
    private Connection connection;

    public DataBaseHelper() {
        initializeConnection();
    }

    public boolean addPoint(Point point) {
        try {
            PreparedStatement prepareStatement = connection.prepareStatement("INSERT INTO points (x, y, r, date, result, \"resultString\", owner)" +
                    "VALUES (?, ?, ?, ?, ?, ?, ?);");
            prepareStatement.setDouble(1, point.getX());
            prepareStatement.setDouble(2, point.getY());
            prepareStatement.setDouble(3, point.getR());
            prepareStatement.setDate(4, new java.sql.Date(point.getDate().getTime()));
            prepareStatement.setBoolean(5, point.isResult());
            prepareStatement.setString(6, point.getResult());
            prepareStatement.setString(7, point.getOwner());
            prepareStatement.execute();
            prepareStatement.close();
            return true;
        } catch (SQLException e) {
            System.out.println("DB Adding error");
            return false;
        }
    }

    public List<Point> getPoints() {
        List<Point> points = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM points;");
            return getPointsData(points, statement, resultSet);
        } catch (SQLException e) {
            System.out.println("DB Select error");
            return points;
        }
    }

    public List<Point> getUserPoints(String ownerID) {
        List<Point> points = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM points WHERE owner='" + ownerID + "';");
            return getPointsData(points, statement, resultSet);
        } catch (SQLException e) {
            System.out.println("DB Select error");
            return points;
        }
    }

    public String executeQuery(String query) {
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);

            StringBuffer buf = new StringBuffer();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int nColumns = metaData.getColumnCount();
            for (int i = 1; i <= nColumns; ++i) {
                buf.append(metaData.getColumnName(i));
                if (i < nColumns)
                    buf.append("\t");
            }
            buf.append("\n");

            while (resultSet.next()) {
                for (int i = 1; i <= nColumns; ++i) {
                    buf.append(resultSet.getString(i));
                    if (i < nColumns)
                        buf.append("\t");
                }
                buf.append("\n");
            }

            statement.close();
            return "EXECUTE_SUCCESS " + buf.toString();
        } catch (SQLException e) {
            System.out.println("DB Select error");
            return "EXECUTE_ERROR " + e.getMessage();
        }
    }

    private List<Point> getPointsData(List<Point> points, Statement statement, ResultSet resultSet) throws SQLException {
        while (resultSet.next()) {
            double x = resultSet.getDouble("x");
            double y = resultSet.getDouble("y");
            double r = resultSet.getDouble("r");
            java.util.Date date = resultSet.getDate("date");
            boolean result = resultSet.getBoolean("result");
            String resultString = resultSet.getString("resultString");
            String owner = resultSet.getString("owner");

            Point point = new Point(x, y, r, date, result, resultString, owner);
            points.add(point);
        }
        statement.close();
        return points;
    }

    private void initializeConnection() {
        try {
            String dbUsername = "postgres";
            String dbPassword = "8864";
            String dbUrl = "jdbc:postgresql://localhost:5432/postgres";

            connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
        } catch (SQLException e) {
            System.err.println("Database connection error, check file with properties, exit...");
            e.printStackTrace();
            System.exit(-1);
        }
    }
}
