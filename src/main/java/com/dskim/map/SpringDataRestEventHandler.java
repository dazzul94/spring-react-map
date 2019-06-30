package com.dskim.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Employee.class)
public class SpringDataRestEventHandler {

//	private final ManagerRepository managerRepository;
	private final UserAccountRepository userAccountRepository;

	@Autowired
	public SpringDataRestEventHandler(UserAccountRepository userAccountRepository) {
		this.userAccountRepository = userAccountRepository;
	}

	@HandleBeforeCreate
	@HandleBeforeSave
	public void applyUserInformationUsingSecurityContext(Employee employee) {

		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		UserAccount userAccount= this.userAccountRepository.findByName(name);
		if (userAccount == null) {
			UserAccount newUserAccount = new UserAccount();
			newUserAccount.setName(name);
			newUserAccount.setRoles(new String[]{"ADMIN"});
			userAccount = this.userAccountRepository.save(newUserAccount);
		}
	}
}
// end::code[]
