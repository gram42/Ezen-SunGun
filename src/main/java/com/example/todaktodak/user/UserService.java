package com.example.todaktodak.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean isUseridAvailable(String userid) {
        return userRepository.findByUserid(userid).isEmpty();
    }

    public void registerUser(UserDTO userDTO) {
        // 비밀번호 확인 추가
        if (!userDTO.getPassword().equals(userDTO.getPasswordCheck())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 이메일 형식 검사
        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!Pattern.matches(emailRegex, userDTO.getEmail())) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);

        User nuwUser = new User();
        nuwUser.setUser(userDTO);

        userRepository.save(nuwUser);
    }

    public User getUserByUserid(String userid){
        // SELECT * FROM member WHERE username=~~; 의 역할을 하는 기능을 구현해야함
        // Repository에 구현함
        Optional<User> result = userRepository.findByUserid(userid);
        if (result.isPresent()){
            return result.get();
        } else {
            return null;
        }
    }

    public void editUserInfo(UserDTO userDTO){

        String password = getUserByUserid(userDTO.getUserid()).getPassword();
        String finalPassword;

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty() ){

            if (passwordEncoder.matches(userDTO.getPassword(), password)) {
                finalPassword = password;
            } else {
                finalPassword = passwordEncoder.encode(userDTO.getPassword());
            }

        } else {
            finalPassword = password;
        }

        User setUser = new User(userDTO.getId(),
                            userDTO.getUserid(),
                            finalPassword,
                            userDTO.getUserName(),
                            userDTO.getEmail(),
                            userDTO.getGender(),
                            userDTO.getBirthDate());

        userRepository.save(setUser);
    }

    public boolean deleteAccount(UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByUserid(userDTO.getUserid());

        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
            return true;
        } else {
            return false;
        }
    }

}

