package com.dskim.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

	private final UserAccountRepository repository;

	@Autowired
	public SpringDataJpaUserDetailsService(UserAccountRepository repository) {
		this.repository = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		UserAccount userAccount = this.repository.findByName(name);
		return new User(userAccount.getName(), userAccount.getPassword(),
				AuthorityUtils.createAuthorityList(userAccount.getRoles()));
	}

}
