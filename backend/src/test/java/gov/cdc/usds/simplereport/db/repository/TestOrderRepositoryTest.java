package gov.cdc.usds.simplereport.db.repository;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.PersistenceException;

import gov.cdc.usds.simplereport.db.model.auxiliary.PersonRole;

import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import gov.cdc.usds.simplereport.db.model.DeviceType;
import gov.cdc.usds.simplereport.db.model.Organization;
import gov.cdc.usds.simplereport.db.model.Person;
import gov.cdc.usds.simplereport.db.model.Provider;
import gov.cdc.usds.simplereport.db.model.TestEvent;
import gov.cdc.usds.simplereport.db.model.TestOrder;
import gov.cdc.usds.simplereport.db.model.auxiliary.TestResult;
import gov.cdc.usds.simplereport.test_util.TestDataFactory;

public class TestOrderRepositoryTest extends BaseRepositoryTest {

	@Autowired
	private TestOrderRepository _repo;
	@Autowired
	private PersonRepository _personRepo;
	@Autowired
	private OrganizationRepository _orgRepo;
	@Autowired
	private ProviderRepository _providers;
	@Autowired
	private TestEventRepository _events;
	@Autowired
	private TestDataFactory _dataFactory;

	@Test
	public void runChanges() {
		Provider mccoy = _providers.save(new Provider("Doc", "", "", "", "NCC1701", null, "(1) (111) 2222222"));

		Organization gwu = _orgRepo.save(new Organization("George Washington", "gwu", "55555", null, mccoy));
		Organization gtown = _orgRepo.save(new Organization("Georgetown", "gt", "66666", null, mccoy));
		Person hoya = _personRepo.save(new Person(gtown, "lookupId", "Joe", null, "Schmoe", null, LocalDate.now(), null, "(123) 456-7890", PersonRole.RESIDENT, "", null, "", "", false, false));
		TestOrder order = _repo.save(new TestOrder(hoya));
		List<TestOrder> queue = _repo.fetchQueueForOrganization(gwu);
		assertEquals(0, queue.size());
		queue = _repo.fetchQueueForOrganization(gtown);
		assertEquals(1, queue.size());
		order.setResult(TestResult.NEGATIVE);
		_repo.save(order);
		assertEquals(0, _repo.fetchQueueForOrganization(gtown).size());
		assertEquals(1, _repo.fetchPastResultsForOrganization(gtown).size());
	}

	@Test
	public void testLifeCycle() {
		Provider mccoy = _providers.save(new Provider("Doc", "", "", "", "NCC1701", null, "(1) (111) 2222222"));
		DeviceType device = _dataFactory.getGenericDevice();
		Organization gtown = _orgRepo.save(new Organization("Georgetown", "gt", "77777", null, mccoy));
		Person hoya = _personRepo.save(new Person(gtown, "lookupId", "Joe", null, "Schmoe", null, LocalDate.now(), null, "(123) 456-7890", PersonRole.RESIDENT, "", null, "", "", false, false));
		TestOrder order = _repo.save(new TestOrder(hoya));
		flush();
		TestEvent ev = _events.save(new TestEvent(TestResult.POSITIVE, device, hoya, gtown));
		order.setTestEvent(ev);
		_repo.save(order);
		flush();
	}

	@Test
	public void createOrder_duplicatesFound_error() {
		Organization org = _dataFactory.createValidOrg();
		Person patient0 = _dataFactory.createMinimalPerson(org);
		TestOrder order1 = new TestOrder(patient0);
		_repo.save(order1);
		flush();
		TestOrder order2 = new TestOrder(patient0);
		PersistenceException caught = assertThrows(PersistenceException.class, ()->{ _repo.save(order2); flush();});
		assertEquals(ConstraintViolationException.class, caught.getCause().getClass());
	}

	@Test
	public void createOrder_duplicateCanceled_ok() {
		Organization org = _dataFactory.createValidOrg();
		Person patient0 = _dataFactory.createMinimalPerson(org);
		TestOrder order1 = new TestOrder(patient0);
		_repo.save(order1);
		flush();
		order1.cancelOrder();
		_repo.save(order1);
		flush();
		TestOrder order2 = new TestOrder(patient0);
		order2 = _repo.save(order2);
		flush();
		assertNotNull(order2.getInternalId());
		assertNotNull(order1.getInternalId());
		assertNotEquals(order1.getInternalId(), order2.getInternalId());
		List<TestOrder> queue = _repo.fetchQueueForOrganization(org);
		assertEquals(1, queue.size());
		assertEquals(order2.getInternalId(), queue.get(0).getInternalId());
	}

	@Test
	public void createOrder_duplicateSubmitted_ok() {
		Organization org = _dataFactory.createValidOrg();
		Person patient0 = _dataFactory.createMinimalPerson(org);
		TestOrder order1 = new TestOrder(patient0);
		_repo.save(order1);
		flush();
		TestEvent didit = _events.save(new TestEvent(TestResult.NEGATIVE, org.getDefaultDeviceType(), patient0, org));
		order1.setTestEvent(didit);
		order1.setResult(didit.getResult());
		_repo.save(order1);
		flush();
		TestOrder order2 = new TestOrder(patient0);
		order2 = _repo.save(order2);
		flush();
		assertNotNull(order2.getInternalId());
		assertNotNull(order1.getInternalId());
		assertNotEquals(order1.getInternalId(), order2.getInternalId());
		List<TestOrder> queue = _repo.fetchQueueForOrganization(org);
		assertEquals(1, queue.size());
		assertEquals(order2.getInternalId(), queue.get(0).getInternalId());
	}

}
