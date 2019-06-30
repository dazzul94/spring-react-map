package com.dskim.map;

import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface UserAccountRepository extends Repository<UserAccount, Long>{

	UserAccount save(UserAccount userAccount);

	UserAccount findByName(String name);
}
