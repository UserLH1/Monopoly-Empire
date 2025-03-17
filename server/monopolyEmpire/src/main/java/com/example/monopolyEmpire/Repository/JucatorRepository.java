package com.example.monopolyEmpire.Repository;
import com.example.monopolyEmpire.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JucatorRepository extends JpaRepository<User, String> {
}
