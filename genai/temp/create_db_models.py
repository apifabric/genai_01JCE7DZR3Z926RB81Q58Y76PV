# using resolved_model gpt-4o-2024-08-06# created from response, to create create_db_models.sqlite, with test data
#    that is used to create project
# should run without error in manager 
#    if not, check for decimal, indent, or import issues

import decimal
import logging
import sqlalchemy
from sqlalchemy.sql import func 
from logic_bank.logic_bank import Rule
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, DateTime, Numeric, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
from datetime import date   
from datetime import datetime

logging.getLogger('sqlalchemy.engine.Engine').disabled = True  # remove for additional logging

Base = declarative_base()  # from system/genai/create_db_models_inserts/create_db_models_prefix.py


class Customer(Base):
    """
    description: Customers with financial accounts and credit limits.
    """
    __tablename__ = 'customer'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    credit_limit = Column(Integer, nullable=False)
    balance = Column(Integer, default=0)  # Derived as sum of orders

    orders = relationship("Order", back_populates="customer")


class Order(Base):
    """
    description: Customer orders, including shipments.
    """
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customer.id'))
    date_shipped = Column(Date, nullable=True)
    amount_total = Column(Integer, default=0)  # Derived as sum of items
    notes = Column(String, nullable=True)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("Item", back_populates="order")


class Item(Base):
    """
    description: Order items with product details and pricing.
    """
    __tablename__ = 'item'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('order.id'))
    product_id = Column(Integer, ForeignKey('product.id'))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Integer)  # Copied from product
    amount = Column(Integer, default=0)  # Derived as quantity * unit_price

    order = relationship("Order", back_populates="items")
    product = relationship("Product")


class Product(Base):
    """
    description: Products available for sale with unit price.
    """
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    unit_price = Column(Integer, nullable=False)

    items = relationship("Item")


# ALS/GenAI: Create an SQLite database
engine = create_engine('sqlite:///system/genai/temp/create_db_models.sqlite')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# ALS/GenAI: Prepare for sample data

# Test Data for Customers
customer1 = Customer(id=1, name="Alice", credit_limit=5000, balance=0)
customer2 = Customer(id=2, name="Bob", credit_limit=3000, balance=0)
customer3 = Customer(id=3, name="Carol", credit_limit=4000, balance=0)
customer4 = Customer(id=4, name="David", credit_limit=3500, balance=0)

# Test Data for Products
product1 = Product(id=1, name="Widget", unit_price=100)
product2 = Product(id=2, name="Gadget", unit_price=150)
product3 = Product(id=3, name="Thingamajig", unit_price=200)
product4 = Product(id=4, name="Doohickey", unit_price=250)

# Test Data for Orders
order1 = Order(id=1, customer_id=1, date_shipped=date(2023, 10, 1), amount_total=0, notes="First Order")
order2 = Order(id=2, customer_id=2, date_shipped=date(2023, 11, 1), amount_total=0, notes="Second Order")
order3 = Order(id=3, customer_id=3, date_shipped=None, amount_total=0, notes="Third Order")
order4 = Order(id=4, customer_id=4, date_shipped=date(2023, 12, 1), amount_total=0, notes="Fourth Order")

# Test Data for Items
item1 = Item(id=1, order_id=1, product_id=1, quantity=1, unit_price=100, amount=100)
item2 = Item(id=2, order_id=2, product_id=2, quantity=2, unit_price=150, amount=300)
item3 = Item(id=3, order_id=3, product_id=3, quantity=3, unit_price=200, amount=600)
item4 = Item(id=4, order_id=4, product_id=4, quantity=4, unit_price=250, amount=1000)


session.add_all([customer1, customer2, customer3, customer4, product1, product2, product3, product4, order1, order2, order3, order4, item1, item2, item3, item4])
session.commit()
