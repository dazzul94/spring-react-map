package com.dskim.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final UserAccountRepository userAccounts;
	private final SearchHistoryRepository searchHistories;

	@Autowired
	public DatabaseLoader(UserAccountRepository userAccountRepository
			, SearchHistoryRepository searchHistoryRepository) {

		this.userAccounts = userAccountRepository;
		this.searchHistories = searchHistoryRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
		
		/* 초기 데이터 적재 */
		UserAccount admin = this.userAccounts.save(new UserAccount("admin", "1111",
				"ADMIN"));
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken("admin", "doesn't matter",
					AuthorityUtils.createAuthorityList("ADMIN")));
		
		// this.searchHistories.save(new SearchHistory("디아뜨", admin));
		// this.searchHistories.save(new SearchHistory("카카오", admin));
		// this.searchHistories.save(new SearchHistory("할리스", admin));
		
		SecurityContextHolder.clearContext();
		
//		Manager greg = this.managers.save(new Manager("greg", "turnquist",
//							"ROLE_MANAGER"));
//		Manager oliver = this.managers.save(new Manager("oliver", "gierke",
//							"ROLE_MANAGER"));
//
//		SecurityContextHolder.getContext().setAuthentication(
//			new UsernamePasswordAuthenticationToken("greg", "doesn't matter",
//				AuthorityUtils.createAuthorityList("ROLE_MANAGER")));
//
//		this.employees.save(new Employee("Frodo", "Baggins", "ring bearer", greg));
//		this.employees.save(new Employee("Bilbo", "Baggins", "burglar", greg));
//		this.employees.save(new Employee("Gandalf", "the Grey", "wizard", greg));
//
//		SecurityContextHolder.getContext().setAuthentication(
//			new UsernamePasswordAuthenticationToken("oliver", "doesn't matter",
//				AuthorityUtils.createAuthorityList("ROLE_MANAGER")));
//
//		this.employees.save(new Employee("Samwise", "Gamgee", "gardener", oliver));
//		this.employees.save(new Employee("Merry", "Brandybuck", "pony rider", oliver));
//		this.employees.save(new Employee("Peregrin", "Took", "pipe smoker", oliver));
//
//		SecurityContextHolder.clearContext();
	}
}
// end::code[]