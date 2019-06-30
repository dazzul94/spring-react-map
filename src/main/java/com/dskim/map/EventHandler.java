package com.dskim.map;

import static com.dskim.map.WebSocketConfiguration.MESSAGE_PREFIX;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(SearchHistory.class)
public class EventHandler {

	private final SimpMessagingTemplate websocket;

	private final EntityLinks entityLinks;

	@Autowired
	public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newSearchHistory(SearchHistory searchHistory) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newSearchHistory", getPath(searchHistory));
	}

	/**
	 * Take an {@link Employee} and get the URI using Spring Data REST's {@link EntityLinks}.
	 *
	 * @param searchHistory
	 */
	private String getPath(SearchHistory searchHistory) {
		return this.entityLinks.linkForSingleResource(searchHistory.getClass(),
				searchHistory.getId()).toUri().getPath();
	}

}
// end::code[]
