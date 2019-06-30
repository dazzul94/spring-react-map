package com.dskim.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(SearchHistory.class)
public class SpringDataRestEventHandler {

	private final UserAccountRepository userAccountRepository;

	@Autowired
	public SpringDataRestEventHandler(UserAccountRepository userAccountRepository) {
		this.userAccountRepository = userAccountRepository;
	}

	@HandleBeforeCreate
	@HandleBeforeSave
	public void applyUserInformationUsingSecurityContext(SearchHistory searchHistory) {

		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		UserAccount userAccount= this.userAccountRepository.findByName(name);
		if (userAccount == null) {
			UserAccount newUserAccount = new UserAccount();
			newUserAccount.setName(name);
			newUserAccount.setRoles(new String[]{"ADMIN"});
			userAccount = this.userAccountRepository.save(newUserAccount);
		}
		searchHistory.setUserAccount(userAccount);
	}
}
