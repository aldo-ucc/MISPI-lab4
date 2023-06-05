package MBeans.beans;

import MBeans.utils.RegistryUtil;
import jakarta.annotation.ManagedBean;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Destroyed;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.event.Observes;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.slovenlypolygon.lab3.model.bean.Point;
import org.slovenlypolygon.lab3.model.utils.DataBaseHelper;

import javax.management.AttributeChangeNotification;
import javax.management.MBeanNotificationInfo;
import javax.management.Notification;
import javax.management.NotificationBroadcasterSupport;
import java.util.List;

@ManagedBean
@ApplicationScoped
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Counter extends NotificationBroadcasterSupport implements CounterMBean {

    private final DataBaseHelper dataBaseHelper = new DataBaseHelper();
    private long sequenceNumber = 0;

    public void init(@Observes @Initialized(ApplicationScoped.class) Object unused) {
        RegistryUtil.registerBean(this, "counter");
    }

    public void destroy(@Observes @Destroyed(ApplicationScoped.class) Object unused) {
        RegistryUtil.unregisterBean(this);
    }

    @Override
    public int getUserPoints() {
        List<Point> points = dataBaseHelper.getPoints();
        if (points.size() % 15 == 0) {
            sendNotification(
                    new Notification(
                            "Multiple of 15",
                            getClass().getSimpleName(),
                            sequenceNumber++,
                            "Point count if multiple of 15!"
                    )
            );
        }
        return dataBaseHelper.getPoints().size();
    }

    @Override
    public int getUserSuccessfullPoints() {
        return (int) dataBaseHelper.getPoints().stream().filter(Point::isResult).count();
    }

    @Override
    public MBeanNotificationInfo[] getNotificationInfo() {
        String[] types = new String[]{AttributeChangeNotification.ATTRIBUTE_CHANGE};
        String name = AttributeChangeNotification.class.getName();
        String description = "Point count if multiple of 15!";
        MBeanNotificationInfo info = new MBeanNotificationInfo(types, name, description);
        return new MBeanNotificationInfo[]{info};
    }

}
