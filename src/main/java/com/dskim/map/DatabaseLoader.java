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
		UserAccount admin2 = this.userAccounts.save(new UserAccount("admin2", "2222",
				"ADMIN"));
		
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken("admin", "doesn't matter",
					AuthorityUtils.createAuthorityList("ADMIN")));
		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken("admin2", "doesn't matter",
					AuthorityUtils.createAuthorityList("ADMIN")));
		
//		this.searchHistories.save(new SearchHistory("카페베네", "1", admin));
//		this.searchHistories.save(new SearchHistory("스타벅스", "2", admin));
//		this.searchHistories.save(new SearchHistory("할리스", "3", admin));
//		
//		this.searchHistories.save(new SearchHistory("롯데리아", "1", admin2));
//		this.searchHistories.save(new SearchHistory("맥도날드", "2", admin2));
//		this.searchHistories.save(new SearchHistory("버거킹", "3", admin2));
		
		SecurityContextHolder.clearContext();
	}
}