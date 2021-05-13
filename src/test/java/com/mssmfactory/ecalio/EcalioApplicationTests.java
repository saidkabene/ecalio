package com.mssmfactory.ecalio;

import com.mssmfactory.ecalio.domainmodel.notifications.Notification;
import com.mssmfactory.ecalio.repositories.compte.CompteRepository;
import com.mssmfactory.ecalio.repositories.notification.NotificationRepository;
import com.mssmfactory.ecalio.services.NotificationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDate;
import java.time.LocalTime;

//@RunWith(SpringRunner.class)
//@SpringBootTest
public class EcalioApplicationTests {

    /*@Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CompteRepository compteRepository;

    @Test
    public void contextLoads() {
        Notification notification = new Notification();
        notification.setTargetedUrl("absence");
        notification.setServiceNotification(Notification.ServiceNotification.ABSENCE);
        notification.setDate(LocalDate.now());
        notification.setContentKey("notification.absence.new.etudiant.content");
        notification.setDestinataire(this.compteRepository.findAll().get(0));
        notification.setHeure(LocalTime.now());
        notification.setTypeNotification(Notification.TypeNotification.WARNING);
        notification.setVue(false);

        this.notificationRepository.save(notification);
    }*/

}
